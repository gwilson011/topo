# Topo

**Topo** is a web application that helps users find the optimal route with the least elevation gain for a specified distance radius. Whether planning a hike, bike ride, or walk, users can visualize the route on an interactive Google Map. The app supports input of either current location or custom coordinates for route calculation.

## Features

-   **Elevation-Based Route Optimization**: Generate routes with minimal elevation gain using Google Maps' Directions and Elevation APIs.
-   **Radius-Based Route Generation**: Create multiple routes that lie exactly on a specified radius from the starting location.
-   **Customizable Start Point**: Choose between using your current location or entering custom coordinates.
-   **Interactive Map**: View the route on an interactive Google Map.

## Getting Started

### Prerequisites

Make sure you have the following installed:

-   Node.js (v14 or higher)
-   npm (v6 or higher)
-   A Google Maps API key (with the necessary APIs enabled: Directions, Elevation, and Maps JavaScript API)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/gwilson011/topo.git
    cd topo
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Google Maps API key:
    ```
    REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
    ```

### Usage

To start the development server, run:

```bash
npm start
```

This will launch the app in development mode, accessible at `http://localhost:3000` in your browser.

### How It Works

-   **Route Calculation**: When users provide a distance radius and starting location (current or custom), the app calculates and displays points on the perimeter of the radius. It then determines the route that minimizes elevation gain.
-   **Loading Screen**: A loading indicator will appear while the route calculation is in progress.
-   **Multiple Routes**: The app can generate multiple routes for the user to choose from, prioritizing those with the least elevation gain.

### Building for Production

To build the app for production:

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

### Testing

Run tests with:

```bash
npm test
```

## Folder Structure

-   `src/components/Map.js`: Contains the interactive Google Map and logic for rendering routes based on input.
-   `src/components/Distance.js`: Handles calculations related to distance,

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add new feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please open an issue in the repository or reach out via LinkedIn.
