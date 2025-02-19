import { Container, Grid2 } from '@mui/material';
import Navigation from './Navigation';
import { useWindowStore } from '../../../shared/store/window';
import { Windows } from '../../../shared/constants/window';

export default function Overview() {
  const window = useWindowStore((state) => state.window);
  const CurrentWindow = Windows[window];

  return (
    <Grid2 container sx={{ height: '100%' }}>
      <Grid2
        size={{ xs: 3, sm: 3, md: 3, lg: 2, xl: 2 }}
        sx={{ height: '100%' }}
      >
        <Container sx={{ height: '100%', paddingTop: 2, paddingBottom: 2 }}>
          <Navigation currentWindow={window} />
        </Container>
      </Grid2>
      <Grid2
        size={{ xs: 9, sm: 9, md: 9, lg: 10, xl: 10 }}
        sx={{ height: '100%' }}
      >
        <Container
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <CurrentWindow />
        </Container>
      </Grid2>
    </Grid2>
  );
}
