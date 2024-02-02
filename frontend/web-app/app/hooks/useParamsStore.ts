import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

type State = {
    pageNumber:number,
    pageCount:number,
    pageSize:number,
    searchTerm:string,
    searchValue:string,
    orderBy:string,
    filterBy:string,
    seller?:string,
    winner?: string

}

type Actions = {
    setParams:(params: Partial<State>) => void,
    reset:() => void,
    setSearchValue: (searchValue: string) => void
}

const initialState = {
    pageSize: 12,
    pageCount: 1,
    pageNumber: 1,
    searchTerm:"",
    searchValue:"",
    orderBy:"make",  
    filterBy:"live",
    seller: undefined,
    winner: undefined  
}

const useParamsStore = createWithEqualityFn<State & Actions>()((set) => ({
    ...initialState,
    setParams: (newParams : Partial<State>)=>{  
        set((state) => {
            if (newParams.pageNumber){
                return {...state, pageNumber: newParams.pageNumber}
            }else
            {
                return {...state,...newParams, pageNumber:1}
            }
        });
    },

    // reset: () => {set((state) => {return {...state, ...initialState}})},
    reset: () => set({...initialState}),

    setSearchValue: (updatedSearchVal : string)=>{  
        set({searchValue: updatedSearchVal});
    },
}), shallow)


export {useParamsStore};