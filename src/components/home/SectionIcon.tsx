export default function SectionIcon({ color = '#E60000' }: { color?: string }) {
  return (
    <div className="flex justify-center mb-2">
      <svg width="85" height="30" viewBox="0 0 85 30" fill="none">
        <path
          d="M0 30C6.18 12.52 22.85 0 42.44 0C62.03 0 78.7 12.52 84.88 30H76.28C75.47 28.17 74.52 26.44 73.44 24.78C72.05 22.66 70.44 20.67 68.6 18.84C66.77 17 64.78 15.39 62.66 14C60.82 12.8 58.89 11.77 56.84 10.9C54.85 10.06 52.82 9.4 50.74 8.93C48.05 8.31 45.28 8 42.44 8C39.6 8 36.84 8.31 34.14 8.93C32.06 9.4 30.03 10.06 28.04 10.9C25.99 11.77 24.05 12.8 22.22 14C20.09 15.39 18.11 17 16.28 18.84C14.44 20.67 12.83 22.66 11.44 24.78C10.36 26.43 9.41 28.17 8.6 30H0Z"
          fill={color}
          fillOpacity="1"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
