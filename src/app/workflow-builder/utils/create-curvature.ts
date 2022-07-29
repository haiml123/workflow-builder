export function createCurvature(start_pos_x: number, start_pos_y: any, end_pos_x: number, end_pos_y: any, curvature_value = 0.5, type = 'openclose'): string {
  const line_x = start_pos_x;
  const line_y = start_pos_y;
  const x = end_pos_x;
  const y = end_pos_y;
  const curvature = curvature_value;
  let hx1 = null;
  let hx2 = null;
  //type openclose open close other
  switch (type) {
    case 'open':
      if(start_pos_x >= end_pos_x) {
        hx1 = line_x + Math.abs(x - line_x) * curvature;
        hx2 = x - Math.abs(x - line_x) * (curvature*-1);
      } else {
        hx1 = line_x + Math.abs(x - line_x) * curvature;
        hx2 = x - Math.abs(x - line_x) * curvature;
      }
      return ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
      case 'close':
      if(start_pos_x >= end_pos_x) {
        hx1 = line_x + Math.abs(x - line_x) * (curvature*-1);
        hx2 = x - Math.abs(x - line_x) * curvature;
      } else {
        hx1 = line_x + Math.abs(x - line_x) * curvature;
        hx2 = x - Math.abs(x - line_x) * curvature;
      }
      return ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
    case 'other':
      if(start_pos_x >= end_pos_x) {
        hx1 = line_x + Math.abs(x - line_x) * (curvature*-1);
        hx2 = x - Math.abs(x - line_x) * (curvature*-1);
      } else {
        hx1 = line_x + Math.abs(x - line_x) * curvature;
        hx2 = x - Math.abs(x - line_x) * curvature;
      }
      return ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
    default:
      hx1 = line_x + Math.abs(x - line_x) * curvature;
      hx2 = x - Math.abs(x - line_x) * curvature;

      return ' M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +'  ' + y;
  }
}
