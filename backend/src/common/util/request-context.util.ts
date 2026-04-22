import { Account } from '@service/account/business/helper/account.business.model';
import {
  ACCOUNT_STATE,
  REGISTRATION_STATE,
} from '@service/account/business/helper/account.business.constant';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '@service/authentication/provider/helper/authentication.provider.constant';
import { UserEntity } from '@service/user/data/helper/user.data.model';
import { WorkspaceEntity } from '@service/workspace/data/helper/workspace.data.model';
import { WorkspaceMembership } from '@service/workspace/business/helper/workspace.business.model';
import { Context } from 'hono';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------------------------------------------
// Request Context
// -----------------------------------------------------------------

/**
 * Represents all possible keys for the request context.
 */
export enum REQUEST_CONTEXT_KEY {
  EXECUTION_CONTEXT = 'executionContext',
  AUTHENTICATION_CONTEXT = 'authenticationContext',
}

declare module 'hono' {
  interface ContextVariableMap {
    [REQUEST_CONTEXT_KEY.EXECUTION_CONTEXT]: ExecutionContext;
    [REQUEST_CONTEXT_KEY.AUTHENTICATION_CONTEXT]: AuthenticationContext;
  }
}

// -----------------------------------------------------------------
// Authentication Context
// -----------------------------------------------------------------

/**
 * Defines the authentication schemes supported by the application.
 */
export enum AUTHENTICATION_SCHEME {
  BEARER = 'BEARER',
  BASIC = 'BASIC',
  NONE = 'NONE',
}

type AuthenticationContextFactoryInput = {
  scheme: AUTHENTICATION_SCHEME;
  credential?: string;
  provider?: AUTHENTICATION_IDENTITY_PROVIDER;
  providerId?: string;
};

/**
 * Represents the authentication details for a given request or operation.
 * It provides a standardized way to access authentication information
 * regardless of the scheme used.
 */
export class AuthenticationContext {
  /**
   * The authentication scheme used (e.g., BEARER, BASIC).
   */
  public readonly scheme: AUTHENTICATION_SCHEME;

  /**
   * The raw credential provided (e.g., the token itself for Bearer auth,
   * or the base64 string for Basic auth). Can be undefined if no
   * credential was supplied.
   */
  public readonly credential?: string;

  /**
   * The unique identifier for the authenticated principal (e.g., user ID,
   * username, or the 'sub' claim from a JWT). This is the resolved
   * identifier that can be used to look up the user/entity in the system.
   */
  public readonly providerId?: string;

  /**
   * The identity provider that issued the authentication credential.
   */
  public readonly provider?: AUTHENTICATION_IDENTITY_PROVIDER;

  private constructor(
    scheme: AUTHENTICATION_SCHEME,
    credential?: string,
    provider?: AUTHENTICATION_IDENTITY_PROVIDER,
    providerId?: string
  ) {
    this.scheme = scheme;
    this.credential = credential;
    this.provider = provider;
    this.providerId = providerId;
  }

  public static with(
    input: AuthenticationContextFactoryInput
  ): AuthenticationContext {
    return new AuthenticationContext(
      input.scheme,
      input.credential,
      input.provider,
      input.providerId
    );
  }

  public static fromRequestContext(
    requestContext: Context
  ): AuthenticationContext {
    return requestContext.get(REQUEST_CONTEXT_KEY.AUTHENTICATION_CONTEXT);
  }

  public static hydrateRequestContext(
    requestContext: Context,
    input: AuthenticationContextFactoryInput
  ): AuthenticationContext {
    const requestcontext = AuthenticationContext.with(input);

    requestContext.set(
      REQUEST_CONTEXT_KEY.AUTHENTICATION_CONTEXT,
      requestcontext
    );

    return requestcontext;
  }
}

// -----------------------------------------------------------------
// Actor Context
// -----------------------------------------------------------------

/**
 * Represents the type of actor in the system.
 */
export enum ACTOR_TYPE {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  ANONYMOUS = 'ANONYMOUS',
}

/**
 * Represents the context of an actor in the system, such as a user or system service.
 */
export class ActorContext {
  constructor(
    public readonly id: string,
    public readonly type: ACTOR_TYPE
  ) {}

  public static generateAnonymousActorId(): string {
    return uuidv4();
  }
}

// -----------------------------------------------------------------
// Account Context
// -----------------------------------------------------------------

export class AccountContext {
  constructor(
    public readonly state: ACCOUNT_STATE,
    public readonly registrationState: REGISTRATION_STATE | undefined,
    public readonly user: UserEntity | undefined,
    public readonly workspace: WorkspaceEntity | undefined,
    public readonly workspaceMembership: WorkspaceMembership | undefined
  ) {}

  public get userId(): string | undefined {
    return this.user?.id ?? undefined;
  }

  public get workspaceId(): string | undefined {
    return this.workspace?.id;
  }

  public get workspaceMemberId(): string | undefined {
    return this.workspaceMembership?.id ?? undefined;
  }

  public isActive(): boolean {
    return this.state === ACCOUNT_STATE.ACTIVE;
  }
}

// -----------------------------------------------------------------
// Trace Context
// -----------------------------------------------------------------

/**
 * Represents the trace context for a request, including a correlation ID.
 */
export class TraceContext {
  public readonly correlationId: string;

  constructor(correlationId: string) {
    this.correlationId = correlationId ?? TraceContext.generateCorrelationId();
  }

  public static generateCorrelationId(): string {
    return uuidv4();
  }
}

// -----------------------------------------------------------------
// Logging Context
// -----------------------------------------------------------------

/**
 * Represents a logging safe context that includes details on the execution context,
 * such as the actor and trace information.
 */
export type LoggingContext = {
  actorId: string;
  actorType: string;
  correlationId: string;
  workspaceId: string | undefined;
  workspaceMemberId: string | undefined;
};

// -----------------------------------------------------------------
// Execution Context
// -----------------------------------------------------------------

type ExecutionContextFactoryInput = {
  // Actor
  actorId: string;
  actorType: ACTOR_TYPE;
  // Trace
  correlationId: string | undefined;
  // Account
  account: Account | undefined;
};

/**
 * Represents the top level context a request, containing details about the actor,
 * the actor's account, and information for tracing the origin of the request.
 */
export class ExecutionContext {
  constructor(
    public readonly actor: ActorContext,
    public readonly trace: TraceContext,
    public readonly account: AccountContext | undefined
  ) {}

  public toLoggingContext(): LoggingContext {
    return {
      actorId: this.actor.id,
      actorType: this.actor.type,
      correlationId: this.trace.correlationId,
      workspaceId: this.account?.workspaceId ?? undefined,
      workspaceMemberId: this.account?.workspaceMemberId ?? undefined,
    };
  }

  // -----------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------

  public isAnonymousActor(): boolean {
    return this.actor.type === ACTOR_TYPE.ANONYMOUS;
  }

  public isSystemActor(): boolean {
    return this.actor.type === ACTOR_TYPE.SYSTEM;
  }

  public isUserActor(): boolean {
    return this.actor.type === ACTOR_TYPE.USER;
  }

  public hasAccount(): this is { account: AccountContext } {
    return this.account !== undefined;
  }

  // -----------------------------------------------------------------
  // Factory Methods
  // -----------------------------------------------------------------

  public static with(input: ExecutionContextFactoryInput): ExecutionContext {
    return new ExecutionContext(
      new ActorContext(input.actorId, input.actorType),
      new TraceContext(
        input.correlationId ?? TraceContext.generateCorrelationId()
      ),
      input.account
        ? new AccountContext(
            input.account.state,
            input.account.registrationState ?? undefined,
            input.account.user ?? undefined,
            input.account.defaultWorkspace?.workspace ?? undefined,
            input.account.defaultWorkspace?.membership ?? undefined
          )
        : undefined
    );
  }

  // -----------------------------------------------------------------
  // Request Context Hydration
  // -----------------------------------------------------------------

  public static fromRequestContext(requestContext: Context): ExecutionContext {
    return requestContext.get(REQUEST_CONTEXT_KEY.EXECUTION_CONTEXT);
  }

  public static hydrateRequestContext(
    requestContext: Context,
    input: ExecutionContextFactoryInput
  ): ExecutionContext {
    const executionContext = ExecutionContext.with(input);

    requestContext.set(REQUEST_CONTEXT_KEY.EXECUTION_CONTEXT, executionContext);

    return executionContext;
  }
}
