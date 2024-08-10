import TaskTable from "@components/organisms/(TaskTable)/TaskTable";
import { apiGetAccount } from "@services/api/apiAccount";
import { apiGetTask } from "@services/api/apiTask";

export const metadata = {
  title: 'Master Tasks',
}

export default async function Home() {
  const task = await apiGetTask()
  const taskData = task?.data.data

  const account = await apiGetAccount()
  const userData = account?.data.data

  return (
    <div className="flex h-[80vh] flex-col">
      <TaskTable taskData={taskData} userData={userData}/>
    </div>
  );
}
