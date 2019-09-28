/**
 * MongoDB by default creates an _id ObjectId field
 * for each document that is inserted into
 * the database.
 * When we create a contact in our
 * client-side Angular app we’ll leave the _id field blank
 * because it will be auto-generated on the server side.
 */

export class Contact {
 // tslint:disable-next-line: variable-name
 _id?: string;
 name: string;
 email: string;
 phone: {
   mobile: string;
   work: string;
 };
}
