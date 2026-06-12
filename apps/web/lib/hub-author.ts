import type { ProjectConfigWithoutSecretProps } from '@/lib/types';

export const ANONYMOUS_DISPLAY_NAME = 'Anonymous';

export function getHideAuthorNames(config: ProjectConfigWithoutSecretProps | null | undefined): boolean {
  return Boolean((config as Record<string, unknown> | null | undefined)?.feedback_hide_author_names);
}

export function getPublicAuthorName(fullName: string, hideAuthorNames: boolean): string {
  return hideAuthorNames ? ANONYMOUS_DISPLAY_NAME : fullName;
}

export function getPublicAuthorInitial(fullName: string, hideAuthorNames: boolean): string {
  if (hideAuthorNames || !fullName) {
    return '?';
  }

  return fullName[0];
}

export function getPublicAvatarUrl(avatarUrl: string | null | undefined, hideAuthorNames: boolean): string {
  return hideAuthorNames ? '' : avatarUrl || '';
}
