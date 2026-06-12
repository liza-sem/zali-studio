import { Database } from '@/lib/supabase';
import type { HubCustomTab } from '@/lib/hub-tabs';
import type { RequestDeadline, RequestPriority } from '@/lib/request-fields';

export type RequestAttachment = {
  url: string;
  name: string;
};

// DB Types
export type ProjectProps = Database['public']['Tables']['projects'];

export type ProjectConfigProps = Database['public']['Tables']['project_configs'];

export type ProjectConfigUpdate = ProjectConfigProps['Update'] & {
  feedback_hide_author_names?: boolean;
  hub_custom_tabs?: HubCustomTab[];
};

export type ProjectConfigWithoutSecretProps = Omit<
  ProjectConfigProps['Row'],
  'integration_sso_secret'
>;

export type TeamMemberProps = Database['public']['Tables']['profiles']['Row'] & {
  joined_at: string;
};

export type NotificationProps = Database['public']['Tables']['notifications']['Row'] & {
  project: { name: string; slug: string; icon: string };
  initiator: { full_name: string };
};

export type ProjectInviteProps = Database['public']['Tables']['project_invites'];

export type ProjectApiKeyProps = Database['public']['Tables']['project_api_keys'];

export type ProjectApiKeyWithoutTokenProps = Omit<ProjectApiKeyProps['Row'], 'token'>;

export type ExtendedInviteProps = ProjectInviteProps['Row'] & {
  project: { name: string; slug: string; icon: string };
  creator: { full_name: string };
};

export type AnalyticsProps = {
  key: string;
  clicks: number;
  visitors: number;
}[];

export type ChangelogProps = Database['public']['Tables']['changelogs'];

export type ChangelogWithAuthorProps = Database['public']['Tables']['changelogs']['Row'] & {
  author: ProfileProps['Row'];
};

export type ChangelogSubscriberProps = Database['public']['Tables']['changelog_subscribers'];

export type FeedbackProps = Database['public']['Tables']['feedback'];

export type FeedbackTagProps = Database['public']['Tables']['feedback_tags'];

export type FeedbackWithUserProps = Database['public']['Tables']['feedback']['Row'] &
  FeedbackRowExtensions & {
    user: ProfileProps['Row'] & { isTeamMember: boolean };
    tags: { name: string; color: string }[];
    has_upvoted: boolean;
  };

export type FeedbackRowExtensions = {
  pinned_url?: string | null;
  pinned_label?: string | null;
  priority?: RequestPriority | null;
  deadline_bucket?: RequestDeadline | null;
  assignee_id?: string | null;
  attachment_urls?: RequestAttachment[] | null;
};

export type FeedbackWithUserInputProps = Database['public']['Tables']['feedback']['Insert'] &
  FeedbackRowExtensions & {
    tags?: string[];
    user?: ProfileProps['Update'];
  };

export type ChangelogRowExtensions = {
  source_feedback_id?: string | null;
};

export type ChangelogInputProps = Database['public']['Tables']['changelogs']['Insert'] & ChangelogRowExtensions;

export type FeedbackCommentProps = Database['public']['Tables']['feedback_comments'];

export type FeedbackCommentWithUserProps = Database['public']['Tables']['feedback_comments']['Row'] & {
  user: ProfileProps['Row'] & { isTeamMember: boolean };
  has_upvoted: boolean;
  replies: FeedbackCommentWithUserProps[];
};

export type ProfileProps = Database['public']['Tables']['profiles'];

// Helper Types
export interface ErrorProps {
  message: string;
  status: number;
}

// Incase error is null, data won't be and vice versa
export type ApiResponse<T, E extends ErrorProps | null = ErrorProps | null> = Promise<
  E extends null ? { data: T; error: null } : { data: null; error: E }
>;

export interface NavbarTabProps {
  name: string;
  icon: {
    dark: Record<string, unknown> | string;
    light: Record<string, unknown> | string;
  };
  slug: string;
}

export interface CategoryTabProps {
  name: string;
  slug: string;
}
