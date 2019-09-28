import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [{
    _id: "111",
    name: '111abc',
    email: 'mail',
    phone: {
      work: '123',
      mobile: '456'
    }
  },{
    _id: "222",
    name: '222def',
    email: 'mail',
    phone: {
      work: '123',
      mobile: '456'
    }
  }];
  selectedContact: Contact;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService
     .getContacts().subscribe(
      response => {
        this.contacts = response;
      },
      error => {
        this.handleError(error);
      }
    );

 }

 private getIndexOfContact = (contactId: String) => {
   return this.contacts.findIndex((contact) => {
     return contact._id === contactId;
   });
 }

 selectContact(contact: Contact) {
   this.selectedContact = contact;
 }

 createNewContact() {
   const contact: Contact = {
     name: '',
     email: '',
     phone: {
       work: '',
       mobile: ''
     }
   };

   // By default, a newly-created contact will have the selected state.
   this.selectContact(contact);
 }

 deleteContact = (contactId: String) => {
   var idx = this.getIndexOfContact(contactId);
   if (idx !== -1) {
     this.contacts.splice(idx, 1);
     this.selectContact(null);
   }
   return this.contacts;
 }

 addContact = (contact: Contact) => {
   this.contacts.push(contact);
   this.selectContact(contact);
   return this.contacts;
 }

 updateContact = (contact: Contact) => {
   var idx = this.getIndexOfContact(contact._id);
   if (idx !== -1) {
     this.contacts[idx] = contact;
     this.selectContact(contact);
   }
   return this.contacts;
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
