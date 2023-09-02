import { IuserData } from '../types/IUser';
import { truncateEthAddress } from '../utils/truncateEthAddress';

interface ProfileProps {
  user: IuserData;
}

export const Profile = ({ user }: ProfileProps) => {
  return (
    <>
      {user?.profileImage && (
        <div className="h-[250px] w-[250px] flex flex-col justify-center items-center  bg-purple-600 rounded-lg">
          <img
            src={user.profileImage}
            alt={user.name}
            className="rounded-full h-32 w-32 object-cover block mx-auto"
          />

          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}

      {user?.wallet && (
        <div className="my-4 text-left">
          <label htmlFor="" className="block text-left">
            🪙Wallet:
          </label>
          {user.wallet && <p>{truncateEthAddress(user.wallet)}</p>}
        </div>
      )}
      {user?.balance && (
        <div className="my-4 text-left">
          <label htmlFor="" className="block text-left">
            💰Balance:
          </label>
          <p>{user.balance}</p>
        </div>
      )}
    </>
  );
};
