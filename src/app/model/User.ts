export interface User {
  uid: string,
  email: string,
  firstName?: string,
  lastName?: string,
  dateOfBirth?: string,
  phoneNumber?: string,
  address: {
    street: string,
    houseNumber: string,
    postBox: string,
    postalCode: string,
    city: string,
    country: string
  },
  role?: string
}
