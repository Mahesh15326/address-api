import pandas as pd
import psycopg2
import os
import glob
import io
from datetime import datetime

conn = psycopg2.connect(
    "postgresql://neondb_owner:npg_7IjuvoHcBwY5@ep-fragrant-math-an6ao7h5.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
)
conn.autocommit = False
cur = conn.cursor()

def clean(text):
    if not text:
        return ''
    return (str(text)
        .replace('\\', ' ')
        .replace('\t', ' ')
        .replace('\n', ' ')
        .replace('\r', ' ')
        .replace('\0', ' ')
        .strip()
    )

now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

try:
    # COUNTRY
    cur.execute('SELECT id FROM "Country" WHERE code = %s', ('IN',))
    existing = cur.fetchone()
    if existing:
        country_id = existing[0]
    else:
        cur.execute(
            'INSERT INTO "Country" (name, code, "createdAt", "updatedAt") VALUES (%s, %s, NOW(), NOW()) RETURNING id',
            ('INDIA', 'IN')
        )
        country_id = cur.fetchone()[0]
    conn.commit()
    print(f"✅ Country ID: {country_id}")

    excel_files = glob.glob("dataset/*.xls") + glob.glob("dataset/*.xlsx")
    print(f"Found {len(excel_files)} state files\n")

    for file_path in excel_files:
        file_name = os.path.basename(file_path)
        print(f"📂 Processing: {file_name}")

        try:
            df = pd.read_excel(file_path)
        except Exception as e:
            print(f"  ❌ Could not read {file_name}: {e}")
            continue

        df.columns = df.columns.str.strip()
        total = len(df)
        print(f"  Rows: {total}")

        # LOAD ALL EXISTING DATA INTO MEMORY
        cur.execute('SELECT code, id FROM "State"')
        state_cache = {code: id for code, id in cur.fetchall()}

        cur.execute('SELECT code, id FROM "District"')
        district_cache = {code: id for code, id in cur.fetchall()}

        cur.execute('SELECT code, id FROM "SubDistrict"')
        subdistrict_cache = {code: id for code, id in cur.fetchall()}

        cur.execute('SELECT code FROM "Village"')
        existing_villages = set(row[0] for row in cur.fetchall())

        print(f"  Loaded existing data into memory ✅")

        village_rows = []

        for index, row in df.iterrows():
            try:
                state_code       = clean(row['MDDS STC'])
                state_name       = clean(row['STATE NAME']).upper()
                district_code    = clean(row['MDDS DTC'])
                district_name    = clean(row['DISTRICT NAME']).upper()
                subdistrict_code = clean(row['MDDS Sub_DT'])
                subdistrict_name = clean(row['SUB-DISTRICT NAME']).upper()
                village_code     = clean(row['MDDS PLCN'])
                village_name     = clean(row['Area Name']).upper()
            except KeyError as e:
                print(f"  ⚠️ Missing column {e}, skipping row {index}")
                continue

            # STATE
            if state_code not in state_cache:
                cur.execute(
                    'INSERT INTO "State" (name, code, "countryId", "createdAt", "updatedAt") VALUES (%s, %s, %s, NOW(), NOW()) RETURNING id',
                    (state_name, state_code, country_id)
                )
                state_cache[state_code] = cur.fetchone()[0]
            state_id = state_cache[state_code]

            # DISTRICT
            if district_code not in district_cache:
                cur.execute(
                    'INSERT INTO "District" (name, code, "stateId", "createdAt", "updatedAt") VALUES (%s, %s, %s, NOW(), NOW()) RETURNING id',
                    (district_name, district_code, state_id)
                )
                district_cache[district_code] = cur.fetchone()[0]
            district_id = district_cache[district_code]

            # SUBDISTRICT
            if subdistrict_code not in subdistrict_cache:
                cur.execute(
                    'INSERT INTO "SubDistrict" (name, code, "districtId", "createdAt", "updatedAt") VALUES (%s, %s, %s, NOW(), NOW()) RETURNING id',
                    (subdistrict_name, subdistrict_code, district_id)
                )
                subdistrict_cache[subdistrict_code] = cur.fetchone()[0]
            subdistrict_id = subdistrict_cache[subdistrict_code]

            # VILLAGE
            if village_code not in existing_villages:
                village_rows.append(
                    f"{village_name}\t{village_code}\t{subdistrict_id}\t{now}\t{now}\n"
                )
                existing_villages.add(village_code)

        # BULK INSERT ALL VILLAGES
        if village_rows:
            village_data = io.StringIO("".join(village_rows))
            cur.copy_expert(
                'COPY "Village" (name, code, "subDistrictId", "createdAt", "updatedAt") FROM STDIN',
                village_data
            )
            conn.commit()
            print(f"  ✅ {len(village_rows)} villages inserted!")

        conn.commit()
        print(f"  ✅ {file_name} complete!\n")

    print("\n🎉 ALL STATES IMPORTED SUCCESSFULLY!")
    for table in ['Country', 'State', 'District', 'SubDistrict', 'Village']:
        cur.execute(f'SELECT COUNT(*) FROM "{table}"')
        print(f"  {table}: {cur.fetchone()[0]} rows")

except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
    raise

finally:
    cur.close()
    conn.close()