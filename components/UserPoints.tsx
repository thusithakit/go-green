'use client'
import useUserDisposals from "@/app/hooks/useUserDisposals";
import LoadingIndicator from "./LoadingIndicator";

interface Disposal {
  userId: string;
  binId: string;
  timestamp: string;
  status: string;
  heightChange: number | null;
  points:number;
}

const UserPoints = ({userEmail}:{userEmail:string}) => {
  const { data:userDisposals, isLoading } = useUserDisposals(userEmail);

  console.log("disposals",userDisposals);
  const convertToPoints = (heightChange:number | null)=>{
    if(heightChange){
      const points = Math.floor(heightChange/10)
      return points;
    }
    else return 0;
  }
  const modifiedDisposals = userDisposals.map(disposal=>(
    {...disposal,points:convertToPoints(disposal.heightChange)}
  ))
  const totalPoints = modifiedDisposals.reduce((acc, disposal: Disposal) => {
        return acc + disposal.points;
      }, 0);
  if (isLoading) {
    return <LoadingIndicator/>;
  }
  return (
    <>
      <h1>Your Total Points: <span className="text-green-500 font-bold mb-4">{totalPoints}</span></h1>
      <div>
        <h2 className="mb-2 border-b-2 border-green-500">Your Disposals History</h2>
        {modifiedDisposals.map((disposal, idx) => (
          <div key={idx} className="mb-2 py-1 border-b border-grey-200">
            <p>Time: {new Date(disposal.timestamp).toLocaleString()}</p>
            <p>Status: {disposal.status}</p>
            <h3>Points: {disposal.points}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserPoints;
