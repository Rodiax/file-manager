import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepContent,
  StepButton,
} from '@mui/material';
import { NavigationList } from '../../../shared/constants/navigation';
import { Windows } from '../../../shared/constants/window';
import { useWindowStore } from '../../../shared/store/window';
import { appFinishedCopying } from '../../../shared/store/app';

interface Props {
  currentWindow: keyof typeof Windows;
}
export default function Navigation({ currentWindow }: Props) {
  const setWindow = useWindowStore((state) => state.setWindow);
  const activeStep = NavigationList.findIndex(
    (item) => item.window === currentWindow
  );

  const handleClick = (step: (typeof NavigationList)[number]) => {
    if (step.isValid() && !appFinishedCopying()) {
      setWindow(step.window);
    }
  };

  return (
    <Stepper activeStep={activeStep} orientation="vertical" /* nonLinear */>
      {NavigationList.map((step, index) => (
        <Step key={step.label}>
          <StepButton disabled={false} onClick={() => handleClick(step)}>
            <StepLabel
              optional={
                index === NavigationList.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
          </StepButton>
          <StepContent>
            <Typography>{step.description}</Typography>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
