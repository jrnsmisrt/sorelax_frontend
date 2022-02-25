export interface User {
  id: string,
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
