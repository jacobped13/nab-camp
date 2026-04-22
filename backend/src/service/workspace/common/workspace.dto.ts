import { z } from 'zod';
import {
  WORKSPACE_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD,
} from './workspace.constant';
import { SortInputDtoSchema } from '@lib/util/pagination.util';

export const WorkspaceInviteSortInputDtoSchema = SortInputDtoSchema.extend({
  field: z.nativeEnum(WORKSPACE_INVITE_SORT_FIELD),
});

export type WorkspaceInviteSortInputDto = z.infer<
  typeof WorkspaceInviteSortInputDtoSchema
>;

export const WorkspaceMemberSortInputDtoSchema = SortInputDtoSchema.extend({
  field: z.nativeEnum(WORKSPACE_MEMBER_SORT_FIELD),
});

export type WorkspaceMemberSortInputDto = z.infer<
  typeof WorkspaceMemberSortInputDtoSchema
>;
