// import { ReduxAction } from "@interface/interfaceRedux";

const initialState = {
  increment: 0,
} // object state untuk menyimpan redux

const dataCount = (state = initialState, action: any) => {
  switch (action.type) {
    case '@APP/COUNT': // id(type) dari reducer yang kita gunakan
      return {
        ...state, // dipakai untuk meraplace key yang sama dengan value berbeda
        increment: action.payload, // mengubah value increment
      }
  }
  return state
}

export default dataCount
