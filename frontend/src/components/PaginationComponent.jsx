
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


const PaginationComponent = ({ allItems, itemsPerPage, onPageChange, initialPage = 1 }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        const startIndex = (value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = allItems.slice(startIndex, endIndex);

        onPageChange(paginatedItems);
    };

    const totalPages = Math.ceil(allItems.length / itemsPerPage);

    return (
        <div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-2">
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            renderItem={(item) => (
                                <PaginationItem
                                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                />
                            )}
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
};


export default PaginationComponent;
