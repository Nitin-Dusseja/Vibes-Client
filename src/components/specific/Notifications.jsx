import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {

  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack padding={"1rem"} width={"35rem"} maxWidth={"80vw"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return <ListItem>
    <Stack
      direction={"row"}
      spacing={"1rem"}
      alignItems={"center"}
      width={"100%"}
    >
      <Avatar />
      <Typography
        variant='body1'
        sx={{
          flexGrow: "1",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >{`${name} Send You a Frend Request`}</Typography>

      <Stack direction={{
        xs: "column",
        sm: "row",
      }}>
        <Button sx={{ marginRight: "10px" }} variant='outlined' onClick={() => handler({ _id, accept: true })}>Accept</Button>
        <Button variant='outlined' color='error' onClick={() => handler({ _id, accept: false })}> Reject</Button>
      </Stack>
    </Stack>
  </ListItem >
})

export default Notifications