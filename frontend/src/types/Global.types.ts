import { Socket } from "socket.io-client";

export interface User {
  createdAt: string;
  email: string;
  fullName: string;
  gender: string;
  updatedAt: string;
  userName: string;
  profileImage: string,
  _id: string;
  mobileNumber?: string,
}

export interface VerifiedUser {
  isLoggedIn: boolean;
  user: {
    _id: string;
    userName: string;
    gender: string;
    email: string;
    fullName: string;
    profileImage: string;
  };
}

export interface Document {
  createdAt: string;
  documentName: string;
  content: string;
  owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface DocumentProps {
  document?: Document;
  socket: Socket;
}

export interface DocumentCardProps {
  data: Document;
  setDeletedDocument: React.Dispatch<React.SetStateAction<string>>;
}

export interface publicAccess {
  tag: string;
  description: string;
}

export interface Collaborators {
  accessType: string;
  email: string,
  fullName: string,
  userName: string,
  profileImage: string,
  _id: string;
}

export interface ShareProps {
  document: Document | undefined;
  setShowShareModal:  React.Dispatch<React.SetStateAction<boolean>>
}

export interface Renameprops {
  name: string | undefined;
  documentId: string;
  setShowRenameModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
}

export interface ActiveUsers {
  documentId: string;
  userDetails: User;
}

export interface ActiveUserprops {
  activeUsers: ActiveUsers[] | undefined;
}


export interface EditorProps {
  documentData?: Document;
  socket: Socket;
}

export interface StartButton {
  text: string,
  link: string
}

export interface LoaderSize {
  size: string,
  border: string,
}

export interface Error404Props {
  document?: string;
}

export interface UserEmailPassword {
  email: string;
  password: string;
}

export interface Collaborator {
  accessType: string,
  userName: string,
  fullName: string,
  email: string,
  _id: string,
  profileImage: string,
}

export interface CollaboratorModalProps {
  collaborator: Collaborator,
  documentId: string,
}