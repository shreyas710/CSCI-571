interface User {
  email: string;
  name: string;
  token: string;
  pic: string;
  _id: string;
  favorites: {id: string, timeCreated: string}[];
}

export default User;
