"use server";

import axios from "axios";
import { reject } from "lodash";

export const apiGetAccount = async () => {
  try {
    const username = await axios.get("http://localhost:3000/account");
    return username;
  } catch (error: any) {
    reject(error);
  }
};
