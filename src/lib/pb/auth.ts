import { CollectionName, PocketBaseClient } from "./client";
import { Schema } from "./database";
import { OAuth2AuthConfig } from "pocketbase";
import { pbTryCatchWrapper } from "./utils";

//  Base interface
export interface BasePocketbaseOperations<T extends CollectionName> {
  pb: PocketBaseClient;
  collection: T;
}

export interface ResetPasswordPocketbaseUser<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  email: string;
}
/**
 * Reset the password for a user in the specified collection.
 *
 * @param {ResetPasswordPocketbaseUser<T>} pb - Pocketbase instance
 * @param {CollectionName} collection - name of the collection
 * @param {string} email - user's email
 * @return {Promise<void>} Promise that resolves after attempting to reset the password
 */
export async function resetPassword<T extends CollectionName>({
  pb,
  collection,
  email,
}: ResetPasswordPocketbaseUser<T>) {
  return pbTryCatchWrapper(
    pb?.collection(collection).requestPasswordReset(email),
  );
}

export interface ResetPasswordConfirmPocketbaseUser<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  token: string;
  password: string;
  passwordConfirm: string;
}
/**
 * Asynchronously confirms the reset of a user's password.
 *
 * @param {ResetPasswordConfirmPocketbaseUser<T>} pb - The Pocketbase instance
 * @param {string} collection - The name of the collection
 * @param {string} token - The reset password token
 * @param {string} password - The new password
 * @param {string} passwordConfirm - The confirmation of the new password
 * @return {Promise<any>} A promise that resolves with the result of the password reset confirmation
 */
export async function confirmResetPassword<T extends CollectionName>({
  pb,
  collection,
  token,
  password,
  passwordConfirm,
}: ResetPasswordConfirmPocketbaseUser<T>) {
  return pbTryCatchWrapper(
    pb
      ?.collection(collection)
      .confirmPasswordReset(token, password, passwordConfirm),
  );
}

export interface CreatePocketbaseUser<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  data: Schema[T]["create"];
}

/**
 * Creates a user in the specified collection using Pocketbase.
 *
 * @param {CreatePocketbaseUser} pb - Pocketbase instance
 * @param {T} data - user data to be created
 * @param {string} collection - name of the collection
 * @return {Promise<any>} a Promise that resolves with the result of user creation
 */
export async function createUser<T extends CollectionName>({
  pb,
  data,
  collection,
}: CreatePocketbaseUser<T>) {
  const res = await pbTryCatchWrapper(pb.collection(collection).create(data));
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  return res;
}
export interface UpdatePocketbaseUser<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  id: string;
  data: Schema[T]["update"];
}

export async function updateUser<T extends CollectionName>({
  pb,
  id,
  data,
  collection
}: UpdatePocketbaseUser<T>) {
  const res = await pbTryCatchWrapper(
    pb.collection(collection).update(id, data),
  );
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  return res;
}

export interface VerifyPocketbaseUserEmail<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  email: string;
}

/**
 * Verify user email for the specified collection.
 *
 * @param {VerifyPocketbaseUserEmail<T>} pb - Pocketbase instance
 * @param {CollectionName} collection - name of the collection
 * @param {string} email - user email to verify
 * @return {Promise<any>} the result of the email verification request
 */
export async function verifyUserEmail<T extends CollectionName>({
  pb,
  collection,
  email,
}: VerifyPocketbaseUserEmail<T>) {
  return await pbTryCatchWrapper(
    pb.collection(collection).requestVerification(email),
  );
}

export interface LoginPocketbaseUser<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  identity: string;
  password: string;
}

/**
 * Perform email and password login for the specified collection.
 *
 * @param {LoginPocketbaseUser<T>} pb - The Pocketbase instance
 * @param {CollectionName} collection - The name of the collection
 * @param {string} identity - The user's identity (email or username)
 * @param {string} password - The user's password
 * @return {Promise<any>} A promise that resolves with the user data
 */
export async function emailPasswordLogin<T extends CollectionName>({
  pb,
  collection,
  identity,
  password,
}: LoginPocketbaseUser<T>) {
  const user = await pbTryCatchWrapper(
    pb.collection(collection).authWithPassword(identity, password),
  );
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  return user;
}

export interface PocketbaseUserOuathLogin<T extends CollectionName>
  extends BasePocketbaseOperations<T> {
  oauth_config: OAuth2AuthConfig;
}
/**
 * Performs an OAuth login with a single click.
 *
 * @param {PocketbaseUserOuathLogin<T>} pb - the Pocketbase user authentication login object
 * @return {Promise} the updated user after the OAuth login
 */
export async function oneClickOauthLogin<T extends CollectionName>({
  pb,
  collection,
  oauth_config,
}: PocketbaseUserOuathLogin<T>) {
  try {
    const authData = await pb
      .collection(collection)
      .authWithOAuth2<RecordManualTypes>(oauth_config);

    const provider = oauth_config.provider;
    function useToUpdate() {
      if (provider === "github") {
        return {
          github_access_token: authData?.meta?.accessToken,
          avatar_url: authData?.meta?.avatarUrl,
        };
      }
      if (provider === "google") {
        return {
          google_access_token: authData?.meta?.accessToken,
          avatar_url: authData?.meta?.avatarUrl,
        };
      }
    }
    const userToUpdate = useToUpdate();
    if (userToUpdate) {
      const updated_user = await pb
        .collection(collection)
        .update(authData.record.id, userToUpdate);
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

      return updated_user;
    }
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    return authData.record;
  } catch (error) {
    throw error;
  }
}

export interface OauthResponseManualTypes {
  token: string;
  record: RecordManualTypes;
  meta: MetaManualTypes;
}

export interface RecordManualTypes {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: string;
  created: string;
  updated: string;
  accessToken: string;
}

export interface MetaManualTypes {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken: string;
  rawUser: {};
}
