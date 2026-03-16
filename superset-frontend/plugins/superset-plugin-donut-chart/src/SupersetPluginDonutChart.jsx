import React from 'react';
import {
 PieChart,
 Pie,
 Cell,
 Tooltip,
 Legend,
 ResponsiveContainer,
} from 'recharts';
import { styled } from '@superset-ui/core';


// Styled wrapper for chart container
const Styles = styled('div')(({ theme, height, width }) => ({
 padding: theme.gridUnit * 4,
 height,
 width,
 '& .recharts-legend-wrapper': {
   marginTop: '10px',
 },
 '& .recharts-pie-label-text': {
   fontSize: '12px',
   fontWeight: 'bold',
 },
}));


// Generate gradient shades (dark → light) from a base color
const generateShades = (n, baseHue = 220, baseSaturation = 80) => {
 return Array.from({ length: n }, (_, i) => {
   const lightness = 20 + (i * 50) / (n - 1);
   return `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`;
 });
};


// Main chart component
export default function SupersetPluginChartKpiCards(props) {
 const {
   data,
   height = 400,
   width = '100%',
   headerText,
   headerFontSize = 'm',
   boldText = true,
   innerRadius = 60,
   showLabels = true,
   showLegend = true,
   decimalPrecision = 0,
   baseHue = 220, // default blue
 } = props;


 if (!data || data.length === 0) {
   return (
     <div style={{ padding: '20px', textAlign: 'center' }}>
       No data available
     </div>
   );
 }


 const normalizedData = data.map(d => ({
   ...d,
   value: Number(d.value),
 }));


 // Generate shades for the number of slices
 const COLORS = generateShades(normalizedData.length, baseHue);


 const fontSizeMap = {
   xs: '12px',
   s: '14px',
   m: '16px',
   l: '18px',
   xl: '20px',
 };


 return (
   <Styles height={height} width={width}>
     {headerText && (
       <div
         style={{
           fontSize: fontSizeMap[headerFontSize] || '16px',
           fontWeight: boldText ? 'bold' : 'normal',
           marginBottom: '10px',
           textAlign: 'center',
         }}
       >
         {headerText}
       </div>
     )}


     <ResponsiveContainer width="100%" height="90%">
       <PieChart>
         <Pie
           data={normalizedData}
           cx="50%"
           cy="50%"
           innerRadius={`${innerRadius}%`}
           outerRadius="80%"
           paddingAngle={3}
           dataKey="value"
           labelLine={false}
           label={
             showLabels
               ? ({ name, percent, value }) => {
                   const numValue = Number(value);
                   return numValue > 0
                     ? `${name} ${numValue.toFixed(decimalPrecision)} (${(percent * 100).toFixed(decimalPrecision)}%)`
                     : null;
                 }
               : false
           }
           isAnimationActive
         >
           {normalizedData.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={COLORS[index]} />
           ))}
         </Pie>


         <Tooltip
           formatter={(value, name) => [Number(value).toFixed(decimalPrecision), name]}
           labelFormatter={(name) => `Category: ${name}`}
         />


         {showLegend && (
           <Legend
             layout="horizontal"
             verticalAlign="bottom"
             align="center"
             wrapperStyle={{ fontSize: '12px' }}
           />
         )}
       </PieChart>
     </ResponsiveContainer>
   </Styles>
 );
}
