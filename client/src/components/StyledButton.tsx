import Button, {ButtonProps} from "react-bootstrap/Button";
import React from "react";

export default function StyledButton(props: ButtonProps) {
  const {disabled, onClick, type} = props
  const btnVariant = props.disabled ? "light" : "success"
  return (
      <Button
          type={type}
          disabled={disabled}
          className="start-btn"
          variant={btnVariant}
          onClick={onClick}>
        {props.children}
      </Button>
  )
}