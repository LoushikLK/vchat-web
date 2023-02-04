export default interface UserType {
  _id: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  lastLoginTime: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  photoUrl: string;
  fcmTokens: {
    web: string;
    android: string;
    ios: string;
  };
  gender: "MALE" | "FEMALE" | "OTHER" | "NONE";
  dateOfBirth: string;
  role: string;
  isLoggedIn: boolean;
  isOnline: boolean;
  blockStatus: "BLOCKED" | "UNBLOCKED";
  role: "ADMIN" | "USER";
  country?: string;
  geoCode?: {
    LONG: string;
    LAT: string;
  };
  createdAt?: string;
}
