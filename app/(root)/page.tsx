import {auth, signOut} from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {

  const session = await auth()
      console.log(session)
  return (

   <main className={`p-10`}>
     <h1 className={`text-white p-10`}>Hello Students</h1>

     <form className={`px-10 pt-[100px]`} action={async ()=> {
       'use server';
         await signOut({redirectTo: ROUTES.SIGN_IN});
     }}>
     </form>
   </main>
  );
}

export default Home;
