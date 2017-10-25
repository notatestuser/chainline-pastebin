import styled from 'styled-components';

export const WidthCappedContainer = styled.div`
  align-items: ${props => props.align || 'normal'};
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  justify-content: ${props => props.justify || 'normal'};
  margin: auto;
  max-width: 1152px;
  width: 100%;
`;

export default WidthCappedContainer;
