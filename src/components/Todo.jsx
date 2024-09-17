import React, { useEffect, useState } from "react";
import "./todolist.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Todo() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [listJob, setListJob] = useState(() => {
    const jobLocal = JSON.parse(localStorage.getItem("jobInfo")) || [];
    return jobLocal;
  });
  const [jobName, setJobName] = useState("");
  const [isShowError, setShowError] = useState(false);
  const [editJob, setEditJob] = useState(null);

  useEffect(() => {
    localStorage.setItem("jobInfo", JSON.stringify(listJob));
  }, [listJob]);

  const handleChangeInput = (e) => {
    const { value } = e.target;
    setJobName(value);
  };

  const validate = (value) => {
    let isValid = true;
    if (!value.trim()) {
      setShowError(true);
      isValid = false;
    } else {
      setShowError(false);
    }
    return isValid;
  };

  const handleAddJob = () => {
    const isValid = validate(jobName);
    if (!isValid) return;

    if (editJob) {
      // Update existing job
      setListJob((prevListJob) =>
        prevListJob.map((job) =>
          job.id === editJob.id ? { ...job, name: jobName } : job
        )
      );
      setEditJob(null);
    } else {
      // Add new job
      const jobInfo = {
        id: Math.ceil(Math.random() * 100000),
        name: jobName,
        status: false,
      };

      setListJob((prevListJob) => [...prevListJob, jobInfo]);
    }

    setJobName("");
  };

  const handleEditJob = (job) => {
    setJobName(job.name);
    setEditJob(job);
  };

  const handleDeleteJob = (id) => {
    setListJob((prevListJob) => prevListJob.filter((job) => job.id !== id));
  };

  const handleToggleStatus = (id) => {
    setListJob((prevListJob) =>
      prevListJob.map((job) =>
        job.id === id ? { ...job, status: !job.status } : job
      )
    );
  };

  return (
    <>
      <div className="input_todo">
        <div className="input_text">
          <input
            className="input" // Changed to className
            name="jobName"
            value={jobName}
            type="text"
            onChange={handleChangeInput}
            placeholder="Enter your notes here"
          />
          <button
            className="button" // Changed to className
            onClick={handleAddJob}
            disabled={!jobName.trim()}
          >
            {editJob ? "Update" : "Add"}
          </button>
        </div>
        {isShowError && <p className="error">Please enter a job name.</p>}
      </div>
      <div className="container">
        <div className="content">
          <h2>To do list</h2>
          <div className="form">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="All" {...a11yProps(0)} />
                  <Tab label="Complete" {...a11yProps(1)} />
                  <Tab label="In Process" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {listJob.map((item) => (
                  <div key={item.id} className="control">
                    <div className="check">
                      <div className="check_item">
                        <label className="checkbox-btn">
                          <input
                            id={`checkbox-${item.id}`}
                            type="checkbox"
                            checked={item.status}
                            onChange={() => handleToggleStatus(item.id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="form__group field">
                        <input
                          type="input"
                          value={item.name}
                          className="form__field"
                          placeholder="Enter your notes here"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="active">
                      <div
                        className="update"
                        onClick={() => handleEditJob(item)}
                      >
                        <i className="bx bx-edit-alt"></i>
                      </div>
                      <div
                        className="delete"
                        onClick={() => handleDeleteJob(item.id)}
                      >
                        <i className="bx bx-trash"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {listJob
                  .filter((job) => job.status)
                  .map((item) => (
                    <div key={item.id} className="control">
                      <div className="check">
                        <div className="check_item">
                          <label className="checkbox-btn">
                            <input
                              id={`checkbox-${item.id}`}
                              type="checkbox"
                              checked={item.status}
                              onChange={() => handleToggleStatus(item.id)}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="form__group field">
                          <input
                            type="input"
                            value={item.name}
                            className="form__field"
                            placeholder="Enter your notes here"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="active">
                        <div
                          className="update"
                          onClick={() => handleEditJob(item)}
                        >
                          <i className="bx bx-edit-alt"></i>
                        </div>
                        <div
                          className="delete"
                          onClick={() => handleDeleteJob(item.id)}
                        >
                          <i className="bx bx-trash"></i>
                        </div>
                      </div>
                    </div>
                  ))}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                {listJob
                  .filter((job) => !job.status)
                  .map((item) => (
                    <div key={item.id} className="control">
                      <div className="check">
                        <div className="check_item">
                          <label className="checkbox-btn">
                            <input
                              id={`checkbox-${item.id}`}
                              type="checkbox"
                              checked={item.status}
                              onChange={() => handleToggleStatus(item.id)}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="form__group field">
                          <input
                            type="input"
                            value={item.name}
                            className="form__field"
                            placeholder="Enter your notes here"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="active">
                        <div
                          className="update"
                          onClick={() => handleEditJob(item)}
                        >
                          <i className="bx bx-edit-alt"></i>
                        </div>
                        <div
                          className="delete"
                          onClick={() => handleDeleteJob(item.id)}
                        >
                          <i className="bx bx-trash"></i>
                        </div>
                      </div>
                    </div>
                  ))}
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
