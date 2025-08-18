'use client'
import useUserDisposals from "@/app/hooks/useUserDisposals";
import LoadingIndicator from "./LoadingIndicator";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";
import PointsIcon from "@/public/points-icon.png";

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
      <div className="mb-4">
          {(() => {
            const lastPending = [...modifiedDisposals]
              .filter(d => d.status === "pending")
              .pop();

            return lastPending && (
              <Card className="bg-gradient-to-br from-green-400 to-green-100">
                <CardHeader>
                  <div className="relative flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white">Ongoing Disposal...</h1>
                    <span className="bg-white px-5 py-2 rounded-full border border-green-500 flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      <span className="italic font-semibold">{lastPending.status}</span>
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Bin ID: {lastPending.binId}</p>
                  <p className="text-xl font-medium">Bin Unlocked Time: {new Date(lastPending.timestamp).toLocaleString()}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-gray-500 italic">
                    <b>Note:</b>Your disposal status will be updated once you close the bin lid.
                  </p>
                </CardFooter>
              </Card>
            );
          })()}
      </div>
      <div className="p-5 flex items-center justify-center flex-col gap-1 bg-gradient-to-tl from-green-200 to-green-50 w-[250px] rounded-xl border-2 border-green-500">
        <h1 className="mb-2 text-xl font-semibold">Total Points</h1>
        <span className="font-bold text-5xl animate-bounce">{totalPoints}</span>
        <Image src={PointsIcon} width={100} height={100} alt="Points icon"/>
      </div>
      <div className="my-6">
        <h2 className="border-b-2 border-green-500 text-xl md:text-3xl mb-4 font-semibold">Your Disposals History</h2>
        {modifiedDisposals.reverse().map((disposal, idx) => (
          <Card key={idx} className="bg-gradient-to-b from-green-50 to-white mb-4">
            <CardHeader>
              <span className="bg-white px-5 py-2 rounded-full border border-green-500 flex items-center justify-center gap-3 w-fit ml-auto">
                  <span className={`w-2 h-2 rounded-full ${disposal.status == "completed" ? "bg-green-500":"bg-amber-400"}`}></span>
                  <span className="italic font-semibold">{disposal.status}</span>
                </span>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-medium">Bin Unlocked Date and Time: {new Date(disposal.timestamp).toLocaleString()}</p>
              <p className="text-xl font-medium">Points Received: {disposal.points}</p>
            </CardContent>
            {disposal.points === 0 && (
              <CardFooter>
                <p className="text-gray-500 italic">
                  <b>Note:</b>You did not receive any points for this disposal as the height change was unnoticeable or still pending.
                </p>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </>
  );
};

export default UserPoints;
