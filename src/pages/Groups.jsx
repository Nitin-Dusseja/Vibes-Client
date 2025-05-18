import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/specific/AvatarCard'
import { Loader, LoaderAnimation } from '../components/specific/Loader'
import UserItem from '../components/specific/UserItem'
import { Link } from '../components/styles/StyledComponents'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation
} from "../redux/api/api"
import { setIsAddMember } from "../redux/reducers/misc"
import ConfirmDeleteDialog from '../components/dialogs/ConfirmDeleteDialog'

const confirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"))

function Groups() {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);
  const IconBtn = <>

    <IconButton sx={{
      display: {
        xs: "block",
        sm: "none",
        position: "fixed",
        right: "1rem",
        top: "1rem"
      }
    }}
      onClick={handleMobile}
    >
      <MenuIcon />
    </IconButton>

    <Tooltip sx={{
      position: "absolute",
      left: "1rem"
    }} title="Back">
      <IconButton onClick={navigateBack}>
        <KeyboardBackspaceIcon />
      </IconButton>
    </Tooltip>
  </>

  const GroupName = <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
    {isEdit ?
      <>
        <TextField
          value={groupNameUpdatedValue}
          onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
        />
        <IconButton onClick={updateGroupName}>
          <DoneIcon />
        </IconButton>
      </> :
      <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton onClick={() => setIsEdit(true)}> <EditIcon /></IconButton>
      </>
    }
  </Stack >


  const ButtonGroup = <Stack direction={{
    sx: "column-reverse",
    sm: "row"
  }}
    spacing={"1rem"}
    p={{
      xs: "1rem",
      sm: "1rem",
      md: "1rem 4rem"
    }}
    sx={{
      gap: "1rem"
    }}
  >
    <Button color='error' size="large" variant='outlined' startIcon={<DeleteIcon />}
      onClick={openConfirmDeleteHandler}
    >Delete Group</Button>
    <Button size="large" variant="contained" startIcon={<AddIcon />}
      onClick={openAddMemberHandler}
    >Add Member</Button>
  </Stack>

  return myGroups.isLoading ? (
    <LoaderAnimation />
  ) : (
    <Grid container maxHeight={"100%"} overflow={"hidden"} height={"100%"}>
      <Grid sx={{
        display: {
          xs: "none",
          sm: "block"
        }
      }}
        item
        xs={0}
        sm={4}
        md={4}
        lg={4}
        bgcolor={"#ffffff"}
        overflow={"auto"}
        maxHeight={"100%"}
        borderRight={"1px solid rgba(0,0,0,0.2)"}
      ><GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} /></Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={8} sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 2rem",
          overflow: "auto"
        }}>
        {IconBtn}
        {groupName &&
          <>
            {GroupName}
            <Typography margin={"1rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              height={"50vh"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0rem",
                md: "1rem 4rem"
              }}
              spacing={"2rem"}
              overflow={"auto"}
            >
              {/* Members */}
              {isLoadingRemoveMember ? (
                <Loader />
              ) : (
                members?.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>
            {ButtonGroup}
          </>
        }
      </Grid>


      {isAddMember && (<Suspense fallback={<Backdrop open />}>
        <AddMemberDialog chatId={chatId} />
      </Suspense>)}
      {
        confirmDeleteDialog &&
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      }
      <Drawer sx={{
        display: {
          xs: "block",
          sm: "none"
        },
        minWidth: "70vw"
      }} open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupsList w={"70vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}


const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} maxHeight={"100vh"} height={"100vh"} overflow={"auto"} >
    {
      myGroups.length > 0 ? (
        myGroups.map((group) => {
          return <GroupListItem group={group} chatId={chatId} key={group._id}></GroupListItem>
        })
      ) : (
        <Typography textAlign={"center"} padding="1rem">
          No Group
        </Typography>
      )
    }
  </Stack >
)

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group
  return (
    <Link to={`?group=${_id}`} sx={{
      padding: "1rem 1rem"
    }}
      onClick={(e) => { if (chatId === _id) e.preventDefault() }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} gap={"1rem"} paddingRight={"1rem"} justifyContent={"space-between"}>
        <AvatarCard avatar={avatar} />
        <Typography sx={{ color: { xs: "black", sm: "black" }, }}>{name}</Typography>
      </Stack>
    </Link>
  )
})

export default Groups