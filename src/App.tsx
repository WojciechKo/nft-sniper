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
import Box from "@mui/system/Box";
import * as React from "react";
import { useCallback, useEffect } from "react";
import {
  Sniper,
  SniperAttributes,
} from "./services/snipersRepository";
import { useSnipers } from "./useSnipers";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface ItemProps {
  sniper: Sniper;
  onDeleteSniper: (s: Sniper) => void;
  onUpdateSniper: (s: Sniper, a: SniperAttributes) => void;
}

// let snipers = [
//   {
//     link: "https://randomearth.io/collections/terra1fnv8f2202zgsnvpju7auehmygmdfj93xls8x0s?sort=price.asc&Item_=Sword%7CEgg",
//   },
//   {
//     link: "https://randomearth.io/collections/terra1flwpxxfl8ldxhdgzxkwet2r37c45hutapgjwkg?sort=price.asc&Utility%20Level_=Ruby%7CThe%20Almond%20Bread%7CSapphire%7CEmerald%7CGold",
//   },
// ];

const Item = ({ sniper, onDeleteSniper, onUpdateSniper }: ItemProps) => {
  const [expand, setExpand] = React.useState(false);
  const [link, setLink] = React.useState(sniper.link);
  const [condition, setCondition] = React.useState(sniper.condition);

  const toggleExpand = useCallback(() => {
    setExpand((prev) => !prev);
  }, [setExpand]);

  const onLinkChange = useCallback(
    (event) => {
    console.log("link changed")
      setLink(event.target.value);
    },
    [setLink]
  );

  const onConditionChange = useCallback(
    (event) => {
    console.log("condition changed")
      setCondition(event.target.value);
    },
    [setCondition]
  );

  const onDeleteClick = useCallback(
    () => {
      onDeleteSniper(sniper);
    },
    [sniper]
  );

  useEffect(() => {
    onUpdateSniper(sniper, { link, condition });
  }, [link, condition]);

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

        <Button variant="outlined">Check market</Button>

        <TextField
          label="Condition"
          variant="outlined"
          value={condition}
          onChange={onConditionChange}
        />

        <Checkbox
          icon={<CachedIcon />}
          checkedIcon={<CachedIcon color="primary" />}
        />

        <IconButton onClick={onDeleteClick}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <Box>Tutaj będzie duzo szczegółów</Box>
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
