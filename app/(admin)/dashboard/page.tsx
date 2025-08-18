import { auth } from '@/auth'
import Users from '@/components/Users';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageAssignedBins from '@/components/ManageAssignedBins';

const page = async () => {
    const session = await auth();
    if(!session || session.user.role !="admin"){
        redirect("/");
    }
  return (
    <div className='mt-20 px-5 pb-10'>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Change User Types</TabsTrigger>
          <TabsTrigger value="bins">Manage Assigned Bins</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Users/>
        </TabsContent>
        <TabsContent value="bins">
          <ManageAssignedBins/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
