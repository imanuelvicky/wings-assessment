"use server";

import axios from "axios";
import { reject } from "lodash";

export const apiGetTask = async () => {
  try {
    const task = await axios.get("http://localhost:3000/task");
    return task;
  } catch (error: any) {
    reject(error);
  }
};

export const apiPostTask = async (body: {
  title: string;
  description: string;
  due_date: string;
  complete: number;
  id_account: number;
}) => {
  try {
    const task = await axios.post("http://localhost:3000/task", body);
    return task;
  } catch (error: any) {
    throw(error);
  }
};

export const apiUpdateTask = async (body: {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  complete: number;
  id_account: number;
}) => {
  await axios
  .put("http://localhost:3000/task", body)
  .catch(err => {
    throw err
  })
};

export const apiDeleteTaskById = async (id: number) => {
  await axios
    .delete(`http://localhost:3000/task?id=${id}`)
    .catch(err => {
      throw err
    })
}

export const apiUpdateTaskComplete = async (body: {id: number, complete: number}) => {
  await axios
   .put(`http://localhost:3000/task/updateMark`, body)
   .catch(err => {
      throw err
    })
}