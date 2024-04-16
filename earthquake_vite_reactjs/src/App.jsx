import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Grid,
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@mui/material";
import "./App.css";
import { getFeatures } from "./store/earthquake";

const App = () => {
  const dispatch = useDispatch();

  const features = useSelector((state) => state.earthquake.features);
  const total = useSelector((state) => state.earthquake.pagination.total);
  const current_page = useSelector(
    (state) => state.earthquake.pagination.current_page
  );

  const [perPage, setPerPage] = useState(10);
  const [magType, setMagType] = useState("");

  const handleChangePerPage = (event) => {
    setPerPage(event.target.value);
    dispatch(
      getFeatures({
        per_page: event.target.value,
        page: 1,
        mag_type: magType,
      })
    );
  };

  const handleChangeMagType = (event) => {
    setMagType(event.target.value);
    dispatch(
      getFeatures({
        per_page: perPage,
        page: 1,
        mag_type: event.target.value,
      })
    );
  };

  const handleChangePagination = (event, value) => {
    dispatch(
      getFeatures({
        per_page: perPage,
        page: value,
        mag_type: magType,
      })
    );
  };

  useEffect(() => {
    dispatch(
      getFeatures({
        per_page: 10,
        page: 1,
        mag_type: magType,
      })
    );
  }, []);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#F1F7E7",
      }}
    >
      <Stack alignItems={"center"}>
        <AppBar
          position="relative"
          sx={{
            width: "90%",
            marginTop: 3,
            height: 100,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h2"
              color="white"
              sx={{ fontWeight: "bold", marginTop: 2 }}
            >
              EARTHQUAKE
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          justifyContent={"end"}
          sx={{ width: "90%", marginTop: 2 }}
        >
          <Grid item xs={2}>
            <TextField
              id="mag_type"
              label="Mag Type"
              sx={{ marginTop: 2 }}
              value={magType}
              onChange={handleChangeMagType}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="per_page"
              label="Per Page"
              sx={{ marginTop: 2 }}
              value={perPage}
              onChange={handleChangePerPage}
              inputProps={{ type: "number" }}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 1,
            marginBottom: 2,
            width: "100%",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ width: "90%", maxHeight: 500 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      #
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      External ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Magnitude
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Place
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Time
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Tsunami
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Mag Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Title
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Longitude
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      Latitude
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"} align="center">
                      External URL
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {features.map((feature, index) => {
                  return (
                    <TableRow key={feature.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{feature.id}</TableCell>
                      <TableCell align="center">{feature.type}</TableCell>
                      <TableCell align="center">
                        {feature.attributes.external_id}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.magnitude}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.place}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.time}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.tsunami.toString()}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.mag_type}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.title}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.coordinates.longitude}
                      </TableCell>
                      <TableCell align="center">
                        {feature.attributes.coordinates.latitude}
                      </TableCell>
                      <TableCell align="center">
                        <a href={feature.links.external_url} target="_blank">
                          Abrir -External URL-
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Pagination
          count={total}
          page={current_page}
          variant="outlined"
          shape="rounded"
          onChange={handleChangePagination}
        />
      </Stack>
    </Box>
  );
};

export default App;
