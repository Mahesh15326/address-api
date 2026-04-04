CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

CREATE UNIQUE INDEX "State_countryId_code_key" ON "State"("countryId", "code");

CREATE UNIQUE INDEX "District_stateId_code_key" ON "District"("stateId", "code");

CREATE UNIQUE INDEX "SubDistrict_districtId_code_key" ON "SubDistrict"("districtId", "code");

CREATE UNIQUE INDEX "Village_subDistrictId_code_key" ON "Village"("subDistrictId", "code");
