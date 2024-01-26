// import { create } from "zustand";

// export type Stack = {
//   userId: string;
//   username: string;
//   email: string;
// };

// interface StackStore {
//   user: Stack | null;

//   isLoading: boolean;

//   isLoggedIn: boolean;

//   actions: {
//     setUser: (user: RegisterUserOutput) => RegisterUserOutput;
//     deleteUser: () => void;
//     setLoading: (loading: boolean) => void;
//     setLoggedIn: (loggedIn: boolean) => void;
//   };
// }

// export const useStackStore = create<StackStore>((set) => ({
//   user: null,
//   isLoading: false,
//   isLoggedIn: false,
//   actions: {
//     setUser: (user): RegisterUserOutput => {
//       set(() => ({
//         user: user,
//       }));
//       return user;
//     },
//     deleteUser() {
//       set(() => ({
//         user: null,
//       }));
//     },
//     setLoading(loading) {
//       set(() => ({
//         isLoading: loading,
//       }));
//     },
//     setLoggedIn(loggedIn) {
//       set(() => ({
//         isLoggedIn: loggedIn,
//       }));
//     },
//   },
// }));
