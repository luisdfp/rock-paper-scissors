import React, {useState} from "react";
import StyledButton from "./StyledButton";
import Form from "react-bootstrap/form"

interface MovePickerProps {
  moves: Move[]
  onPick: (moveId: string) => void
}

export default (props: MovePickerProps) => {
  const {moves, onPick} = props
  const [selectedMove, setSelectedMove] = useState('')

  function onConfirm() {
    onPick(selectedMove)
    setSelectedMove('')
  }

  return (
      <div className="move-picker">
        <span style={{paddingRight: '15px'}}>Your move:</span>
        <Form.Control as="select" name="move" value={selectedMove} onChange={e => setSelectedMove(e.target.value)}>
          <option value='' disabled>Choose an option</option>
          {moves.map(move =>
              <option key={move.id} value={move.id}>{move.name}</option>
          )}
        </Form.Control>
        <div style={{marginTop: '20px'}}>
          <StyledButton disabled={!selectedMove}
                        onClick={onConfirm}>
            Confirm
          </StyledButton>
        </div>
      </div>
  )
}