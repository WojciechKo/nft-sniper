import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Sniper, SniperAttributes } from "./services/snipersRepository";
import { useSnipers } from "./useSnipers";

declare global {
  interface Window {
    fetchFloorPrice: any;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface SniperResult {
  sniper: Sniper;
  floorPrice: number;
}

interface ItemProps {
  sniper: Sniper;
  onDeleteSniper: (s: Sniper) => void;
  onUpdateSniper: (s: Sniper, a: SniperAttributes) => void;
}

const Item = ({ sniper, onDeleteSniper, onUpdateSniper }: ItemProps) => {
  const [expand, setExpand] = React.useState(false);
  const toggleExpand = useCallback(() => {
    setExpand((prev) => !prev);
  }, [setExpand]);

  const [link, setLink] = React.useState(sniper.link);
  const onLinkChange = useCallback(
    (event) => {
      console.log("link changed");
      setLink(event.target.value);
    },
    [setLink]
  );

  const [condition, setCondition] = React.useState(sniper.condition);
  const onConditionChange = useCallback(
    (event) => {
      console.log("condition changed");
      setCondition(event.target.value);
    },
    [setCondition]
  );

  const onDeleteClick = useCallback(() => {
    onDeleteSniper(sniper);
  }, [sniper, onDeleteSniper]);

  const [floorPrice, setFloorPrice] = React.useState<number>();

  useEffect(() => {
    onUpdateSniper(sniper, { link, condition, floorPrice });
  }, [link, condition, floorPrice, onUpdateSniper]);

  const onUpdatePricesClick = useCallback(() => {
    window.fetchFloorPrice(sniper);
  }, [sniper]);

  const onNewFloorPrice = useCallback(
    (event: Event) => {
      console.log(event);
      const { sniper, floorPrice } = (event as CustomEvent)
        .detail as SniperResult;

      console.log("window.addEventListener: New price arrived", floorPrice);
      setFloorPrice(floorPrice);
    },
    [setFloorPrice]
  );

  React.useEffect(() => {
    const eventName = `floorPriceFetched-${sniper._id}`;
    window.addEventListener(eventName, onNewFloorPrice);
    return () => {
      window.removeEventListener(eventName, onNewFloorPrice);
    };
  }, [sniper, onNewFloorPrice]);

  return (
    <Paper sx={{ m: 1, p: 1 }}>
      <Box>
        <IconButton onClick={toggleExpand}>
          {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>

        <TextField
          label="Market link"
          variant="outlined"
          value={link}
          onChange={onLinkChange}
        />

        <TextField
          label="Condition"
          variant="outlined"
          value={condition}
          onChange={onConditionChange}
        />

        <Button variant="outlined" onClick={onUpdatePricesClick}>
          Update prices
        </Button>

        <Checkbox
          icon={<CachedIcon />}
          checkedIcon={<CachedIcon color="primary" />}
        />

        <Typography variant="body2">Filtered price: {floorPrice}</Typography>

        <IconButton onClick={onDeleteClick}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <Box>
          <Typography variant="body1">Filtered price: {floorPrice}</Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default function App() {
  const { snipers, onNewSniper, onDeleteSniper, onUpdateSniper } = useSnipers();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Button variant="contained" onClick={onNewSniper}>
          New Sniper
        </Button>
        {snipers.map((sniperData) => (
          <Item
            key={sniperData._id}
            sniper={sniperData}
            onDeleteSniper={onDeleteSniper}
            onUpdateSniper={onUpdateSniper}
          />
        ))}
      </Container>
    </ThemeProvider>
  );
}
