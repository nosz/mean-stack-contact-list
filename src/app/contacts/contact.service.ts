import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsURL = '/api/contacts';

  constructor(private http: HttpClient) {}

  // get("api/contacts")
  getContacts() {
    return this.http.get<any>(this.contactsURL);
  }

  // post("/api/contacts")
  createContact(newContact: Contact) {
    return this.http.post<Contact>(this.contactsURL, newContact)
    /* .subscribe(
      response => {
        return response.json() as Contact;
      },
      error => {
        this.handleError(error);
      }
    ); */
  }

  // delete("/api/contacts/:id")
  deleteContact(delContactId) {
    return this.http.delete(this.contactsURL + '/' + delContactId)
    /* .subscribe(
      response => {
        return response.json() as string;
      },
      error => {
        this.handleError(error);
      }
    ); */
  }

  // put("/api/contacts/:id")
  updateContact(putContact: Contact) {
    const putURL = this.contactsURL + '/' + putContact._id;

    return this.http.put(putURL, putContact);
   /*  .subscribe(
      response => {
        return response.json() as string;
      },
      error => {
        this.handleError(error);
      }
    ); */
  }

  // error handler
 private handleError(error: any) {
  const errMsg = error.message
    ? error.message
    : error.status
    ? `${error.status} - ${error.statusText}`
    : 'Server error';
  console.error(errMsg);
}


}
