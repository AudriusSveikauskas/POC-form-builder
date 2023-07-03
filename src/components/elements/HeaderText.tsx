import React from "react";
import { Box, Typography } from "@mui/material";
import { Rnd } from "react-rnd";

const HeaderText = () => {
  console.log(123);

  return (
    <Box>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        <Typography sx={{ color: "blue" }}>56454</Typography>
      </Rnd>
    </Box>
  );
};

export default HeaderText;
