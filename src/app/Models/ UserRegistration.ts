import { v4 as uuidv4 } from 'uuid';

export class UserRegistration {
    public userId: string;
    public bedrijfsNaam: string;
    public kvkNummer: string;
    public btw: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public address?: Address;
    public nameid? : string;
    public isApproved: boolean;
    
   

    constructor(data: any) {
        this.userId = uuidv4();
        this.bedrijfsNaam = data.bedrijfsNaam;
        this.kvkNummer = data.kvkNummer;
        this.btw = data.btw
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
        this.address = data.address;
        this.isApproved = data.isApproved;
      

       
    }
}

export class Address {
    street: string;
    zipCode: string;
    residence: string;
    phoneNumber: string;

    constructor(data: any) {
        this.street = data.street;
        this.zipCode = data.zipCode;
        this.residence = data.residence;
        this.phoneNumber = data.phoneNumber
    }
}


