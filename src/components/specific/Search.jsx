import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserItem from './UserItem'
import { setIsSearch } from '../../redux/reducers/misc'
import { useDispatch, useSelector } from 'react-redux'
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from '../../hooks/hook'

const Search = () => {
  const search = useInputValidation("")
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  const [users, setUsers] = useState([])

  const [sendFriendRequest, isLoadingSendFriendReques] = useAsyncMutation(useSendFriendRequestMutation)

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend request... ", { userId: id })
  }
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack padding={"2rem"} direction={"column"} width={"25rem"} maxWidth={"80vw"}>
        <DialogTitle textAlign={"center"}> Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler}
          variant='outlined'
          size='small'
          slotProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <List >
          {
            users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendReques}
              />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search