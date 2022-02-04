import {City, District, PostalCode, PostalCodeCityProvince, Province, SubDistrict} from "./location.model";

export class ConfigurationStoreLocation {
    phoneNumber: string;
    email: string;
    province: Province = new Province();
    city: City = new City();
    district: District = new District();
    subDistrict: SubDistrict = new SubDistrict();
    postalCode: PostalCode = new PostalCode();
    postalCodeCityProvince : PostalCodeCityProvince = new PostalCodeCityProvince();
    address: string;
    postalCodeUiId: string;
    image: string;
    name: string;
    link: string;
    businessServiceClientName: string;
}
