import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui

import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useResponsive } from 'src/hooks/use-responsive';
// api
import { clickConversation } from 'src/api/chat';
//
import { useGetNavItem } from './hooks';

// ----------------------------------------------------------------------

export default function ChatNavItem({ selected, collapse, conversation, onCloseMobile }) {
  const { user } = useMockedUser();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const { participants } = useGetNavItem({
    conversation,
    currentUserId: `${user?.id}`,
  });

  const singleParticipant = participants[0];

  const { name } = singleParticipant;

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      await clickConversation(conversation.id);

      router.push(`${paths.dashboard.chat}?id=${conversation.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  const renderSingle = (
    <Avatar
      alt={name}
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png"
      sx={{ width: 48, height: 48 }}
    />
  );

  return (
    <ListItemButton
      disableGutters
      onClick={handleClickConversation}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      {renderSingle}
      {!collapse && (
        <ListItemText
          sx={{ ml: 2 }}
          primary="GPT Conversation"
          primaryTypographyProps={{
            noWrap: true,
            variant: 'subtitle2',
          }}
        />
      )}
    </ListItemButton>
  );
}

ChatNavItem.propTypes = {
  collapse: PropTypes.bool,
  conversation: PropTypes.object,
  onCloseMobile: PropTypes.func,
  selected: PropTypes.bool,
};
