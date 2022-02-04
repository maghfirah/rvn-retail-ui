export class Location {
    province: Province[];
    city: City[];
    district: District[];
    subDistrict: SubDistrict[];
    postalCode: PostalCode[];
    postalCodeCityProvince: PostalCodeCityProvince[];
}

export class Province {
    name: string;
    uiId: string;
}

export class City {
    name: string;
    uiId: string;
}

export class District {
    name: string;
    uiId: string;
}
export class SubDistrict {
    name: string;
    uiId: string;
}
export class PostalCode {
    name: string;
    uiId: string;
}

export class PostalCodeCityProvince {
    name: string;
    uiId: string;
}

export class General {
    name: string;
    uiId: string;
}
