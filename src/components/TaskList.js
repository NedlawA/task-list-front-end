import React from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import './TaskList.css';

const TaskList = (props) => {
  return <ul className='tasks__list no-bullet'>
    {props.tasks.map((task) => (
      <Task
        key={task.id}
        id={task.id}
        title={task.title}
        isComplete={task.isComplete}
        onClickCallback={props.onClickCallback}
        onDeleteCallback={props.onDeleteCallback}
      />
    ))}
  </ul>;
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onClickCallback: PropTypes.func,
  onDeleteCallback: PropTypes.func
};

export default TaskList;
