cmake_minimum_required(VERSION 3.14)
project(FraudEngine CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

# Source files
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Exclude test files if any are inside src, though they should be in tests/
add_executable(fraud-engine ${SOURCES})
target_include_directories(fraud-engine PRIVATE src)
target_link_libraries(fraud-engine PRIVATE nlohmann_json::nlohmann_json)

# Create test executables
enable_testing()
file(GLOB_RECURSE TEST_SOURCES "tests/*.cpp")
foreach(TEST_SOURCE ${TEST_SOURCES})
    get_filename_component(TEST_NAME ${TEST_SOURCE} NAME_WE)
    
    # We need to compile the test source along with all non-main src files
    file(GLOB_RECURSE APP_SOURCES "src/*.cpp")
    list(REMOVE_ITEM APP_SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")
    
    add_executable(${TEST_NAME} ${TEST_SOURCE} ${APP_SOURCES})
    target_include_directories(${TEST_NAME} PRIVATE src)
    target_link_libraries(${TEST_NAME} PRIVATE nlohmann_json::nlohmann_json)
    add_test(NAME ${TEST_NAME} COMMAND ${TEST_NAME})
endforeach()
