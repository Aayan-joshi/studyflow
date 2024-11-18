import {signOut} from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {

  return (

   <div className={`text-white`}>
     <div>
         <h1 className={`text-3xl text-white`}>Welcome to StudyFlow</h1>
         <p className={`text-lg`}>Your personal study assistant</p>
     </div>

     <form className={`px-10 pt-[100px]`} action={async ()=> {
       'use server';
         await signOut({redirectTo: ROUTES.SIGN_IN});
     }}>
     </form>
   </div>
  );
}

export default Home;
