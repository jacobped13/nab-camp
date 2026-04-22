import { Nullable } from '@common';
import { WORKSPACE_INVITE_TARGET_TYPE } from '@service/workspace/common/workspace.constant';

/**
 * Represents a user's default workspace connection in the system.
 */
export class UserDefaultWorkspaceEntity {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a workspace entity in the system.
 */
export class WorkspaceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: Nullable<string>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a member of a workspace in the system.
 */
export class WorkspaceMemberEntity {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a workspace invite in the system.
 */
export class WorkspaceInviteEntity {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    public readonly targetId: string,
    public readonly targetType: WORKSPACE_INVITE_TARGET_TYPE,
    public readonly codeHash: string,
    public readonly acceptedAt: Nullable<Date>,
    public readonly declinedAt: Nullable<Date>,
    public readonly expireAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public isExpired(): boolean {
    return this.expireAt.getTime() < Date.now();
  }

  public isAccepted(): boolean {
    return this.acceptedAt !== null;
  }

  public isDeclined(): boolean {
    return this.declinedAt !== null;
  }

  public isEffective(): boolean {
    return !this.isExpired() && !this.isAccepted() && !this.isDeclined();
  }

  public isEmailInvite(): boolean {
    return this.targetType === WORKSPACE_INVITE_TARGET_TYPE.EMAIL;
  }
}
