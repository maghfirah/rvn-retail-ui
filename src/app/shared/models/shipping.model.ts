export class Shipping {
    instant : Type = new Type();
    sameDay : Type = new Type();
    digital : Type = new Type();
    regular : Type = new Type();
    express : Type = new Type();
    trucking : Type = new Type();
}

export class Type {
    type : string;
    details : Detail[] = [];
}

export class Detail {
    compulsoryInsurance : boolean;
    finalRate : number; //sebelum ditambah dengan insuranceRate
    insuranceRate : number;
    totalRate : number;
    logoUrl : string;
    maxDay : number;
    minDay : number;
    name : string;
    rateName : string;
    uiId : string;
}
