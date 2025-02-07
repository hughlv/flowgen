FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV OPENBLAS_NUM_THREADS=4
ENV MKL_NUM_THREADS=4
ENV OMP_NUM_THREADS=4
ENV NUMEXPR_NUM_THREADS=4
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    # Playwright system dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install poetry and add to PATH
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Copy poetry files
COPY pyproject.toml poetry.lock ./

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create true \
    && poetry config virtualenvs.in-project true \
    && poetry install --no-interaction --no-ansi

# Install Playwright browsers
RUN poetry run playwright install --with-deps chromium firefox webkit

# Copy application code
COPY . .

# Run the application
CMD ["poetry", "run", "uvicorn", "agentok_api.main:app", "--host", "0.0.0.0", "--port", "5004"]